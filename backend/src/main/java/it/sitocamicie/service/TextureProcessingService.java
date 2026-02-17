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

    public TextureProcessingService(FileStorageService storage,
                                    TextureRepository textureRepository,
                                    TaskExecutor taskExecutor,
                                    @Value("${app.texture.process.size:1024}") int processedSize,
                                    @Value("${app.texture.thumb.size:256}") int thumbnailSize) {
        this.storage = storage;
        this.textureRepository = textureRepository;
        this.taskExecutor = taskExecutor;
        this.processedSize = processedSize;
        this.thumbnailSize = thumbnailSize;
    }

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

                // simple resize as placeholder for real seamless/tillable algorithm
                Thumbnails.of(src).size(processedSize, processedSize).keepAspectRatio(true).toFile(processedPath.toFile());
                Thumbnails.of(src).size(thumbnailSize, thumbnailSize).keepAspectRatio(true).toFile(thumbPath.toFile());

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
}
