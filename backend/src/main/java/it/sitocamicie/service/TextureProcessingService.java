package it.sitocamicie.service;

import it.sitocamicie.model.Texture;
import it.sitocamicie.repository.TextureRepository;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Optional;

@Service
public class TextureProcessingService {

    private final FileStorageService storage;
    private final TextureRepository textureRepository;
    private final TaskExecutor taskExecutor;
    private final int processedSize;
    private final int thumbnailSize;
    private final boolean useOpenCV;
    
    public TextureProcessingService(FileStorageService storage,
                                    TextureRepository textureRepository,
                                    TaskExecutor taskExecutor,
                                    @Value("${app.texture.process.size:1024}") int processedSize,
                                    @Value("${app.texture.thumb.size:256}") int thumbnailSize,
                                    @Value("${app.texture.use-opencv:false}") boolean useOpenCV) {
        this.storage = storage;
        this.textureRepository = textureRepository;
        this.taskExecutor = taskExecutor;
        this.processedSize = processedSize;
        this.thumbnailSize = thumbnailSize;
        this.useOpenCV = useOpenCV;
    public Texture saveAndProcess(MultipartFile file, String name) throws IOException {
        Path original = storage.storeTexture(file, file.getOriginalFilename());

        Texture t = new Texture();
        t.setName(name == null || name.isBlank() ? file.getOriginalFilename() : name);
        t.setOriginalPath(original.getFileName().toString());
        t = textureRepository.save(t);

        // async processing (generate processed + thumbnail)
        taskExecutor.execute(() -> {
            try {
                File src = original.toFile();
                String processedFile = "processed_" + original.getFileName().toString();
                String thumbFile = "thumb_" + original.getFileName().toString();

                Path processedPath = storage.getTexturePath(processedFile);
                Path thumbPath = storage.getTexturePath(thumbFile);

                // generate a tillable (seamless-like) texture and thumbnail
                java.awt.image.BufferedImage srcImg = javax.imageio.ImageIO.read(src);
                if (useOpenCV) {
                    // use OpenCV/JavaCV for improved seamless processing
                    OpenCVUtils.generateTiled(src.getAbsolutePath(), processedPath.toFile().getAbsolutePath(), processedSize);
                    OpenCVUtils.generateTiled(src.getAbsolutePath(), thumbPath.toFile().getAbsolutePath(), thumbnailSize);
                } else {
                    java.awt.image.BufferedImage processedImg = makeTiled(srcImg, processedSize);
                    javax.imageio.ImageIO.write(processedImg, "png", processedPath.toFile());
                    java.awt.image.BufferedImage thumbImg = makeTiled(srcImg, thumbnailSize);
                    javax.imageio.ImageIO.write(thumbImg, "png", thumbPath.toFile());
                }

                Optional<Texture> opt = textureRepository.findById(t.getId());
                if (opt.isPresent()) {
                    Texture persisted = opt.get();
                    persisted.setProcessedPath(processedFile);
                    persisted.setThumbnailPath(thumbFile);
                    persisted.setIsTillable(true);
                    textureRepository.save(persisted);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });

        return t;
    }

    /**
     * Basic tiling: scale source to fill target, offset by half width/height and blend seam areas.
     * This is a pragmatic, deterministic approach (not AI), suitable for MVP.
     */
    private java.awt.image.BufferedImage makeTiled(java.awt.image.BufferedImage src, int size) {
        java.awt.image.BufferedImage dst = new java.awt.image.BufferedImage(size, size, java.awt.image.BufferedImage.TYPE_INT_ARGB);
        java.awt.Graphics2D g = dst.createGraphics();
        g.setRenderingHint(java.awt.RenderingHints.KEY_INTERPOLATION, java.awt.RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        // scale source to cover target
        double sx = (double) size / src.getWidth();
        double sy = (double) size / src.getHeight();
        double scale = Math.max(sx, sy);
        int w = (int) Math.round(src.getWidth() * scale);
        int h = (int) Math.round(src.getHeight() * scale);
        // draw tiled background (4 tiles) to reduce seams
        for (int ix = -1; ix <= 1; ix++) {
            for (int iy = -1; iy <= 1; iy++) {
                int dx = (size - w) / 2 + ix * w;
                int dy = (size - h) / 2 + iy * h;
                g.drawImage(src, dx, dy, w, h, null);
            }
        }
        // offset-blend seams: create half-offset copy and blend with alpha gradient
        java.awt.image.BufferedImage offset = new java.awt.image.BufferedImage(size, size, java.awt.image.BufferedImage.TYPE_INT_ARGB);
        java.awt.Graphics2D go = offset.createGraphics();
        go.setRenderingHint(java.awt.RenderingHints.KEY_INTERPOLATION, java.awt.RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        int ox = size / 2;
        int oy = size / 2;
        go.drawImage(dst, -ox, -oy, null);
        go.dispose();

        // blend offset onto dst with radial alpha falloff near edges
        java.awt.image.BufferedImage blended = new java.awt.image.BufferedImage(size, size, java.awt.image.BufferedImage.TYPE_INT_ARGB);
        java.awt.Graphics2D gb = blended.createGraphics();
        gb.drawImage(dst, 0, 0, null);

        java.awt.Composite original = gb.getComposite();
        for (int y = 0; y < size; y++) {
            for (int x = 0; x < size; x++) {
                float dxCenter = Math.abs(x - size / 2f) / (size / 2f);
                float dyCenter = Math.abs(y - size / 2f) / (size / 2f);
                float factor = Math.max(dxCenter, dyCenter); // 0 center -> 1 edge
                float alpha = 0.5f * (1.0f - factor); // stronger blending near center
                if (alpha <= 0) continue;
                int srcRGB = dst.getRGB(x, y);
                int offRGB = offset.getRGB(x, y);
                int r = (int) ((1 - alpha) * ((srcRGB >> 16) & 0xFF) + alpha * ((offRGB >> 16) & 0xFF));
                int gCol = (int) ((1 - alpha) * ((srcRGB >> 8) & 0xFF) + alpha * ((offRGB >> 8) & 0xFF));
                int b = (int) ((1 - alpha) * (srcRGB & 0xFF) + alpha * (offRGB & 0xFF));
                int a = 255;
                int rgb = (a << 24) | (r << 16) | (gCol << 8) | b;
                gb.drawRect(x, y, 1, 1); // noop for iteration
                blended.setRGB(x, y, rgb);
            }
        }
        gb.setComposite(original);
        gb.dispose();
        // final smoothing: draw blended over dst with low opacity
        java.awt.Graphics2D gfin = dst.createGraphics();
        gfin.setComposite(java.awt.AlphaComposite.getInstance(java.awt.AlphaComposite.SRC_OVER, 0.5f));
        gfin.drawImage(blended, 0, 0, null);
        gfin.dispose();
        return dst;
    }
}

