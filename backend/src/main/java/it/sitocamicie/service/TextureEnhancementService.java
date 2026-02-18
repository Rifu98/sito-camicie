package it.sitocamicie.service;

import it.sitocamicie.model.Texture;
import it.sitocamicie.repository.TextureRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.util.Optional;

@Service
public class TextureEnhancementService {

    private final FileStorageService storage;
    private final TextureRepository textureRepository;
    private final boolean useOpenCV;
    private final String aiProviderUrl; // optional external AI provider

    public TextureEnhancementService(FileStorageService storage, TextureRepository textureRepository,
                                     @Value("${app.texture.use-opencv:true}") boolean useOpenCV,
                                     @Value("${app.texture.ai.provider-url:}") String aiProviderUrl) {
        this.storage = storage;
        this.textureRepository = textureRepository;
        this.useOpenCV = useOpenCV;
        this.aiProviderUrl = aiProviderUrl == null ? "" : aiProviderUrl.trim();
    }

    /**
     * Enhance a texture (synchronous). Returns updated Texture entity.
     * If an external AI provider is configured it is attempted first; otherwise local OpenCV pipeline is used.
     */
    public Optional<Texture> enhance(Long textureId) {
        Optional<Texture> opt = textureRepository.findById(textureId);
        if (opt.isEmpty()) return Optional.empty();
        Texture t = opt.get();
        try {
            Path original = storage.getTexturePath(t.getOriginalPath());
            String outName = "enhanced_" + original.getFileName().toString();
            Path outPath = storage.getTexturePath(outName);

            boolean done = false;
            // try external AI provider if configured
            if (!aiProviderUrl.isBlank()) {
                // generic HTTP-based provider contract (POST base64 -> base64). If not configured/available, fallback.
                try {
                    byte[] outBytes = callExternalProvider(original.toFile());
                    if (outBytes != null && outBytes.length > 0) {
                        java.nio.file.Files.write(outPath, outBytes);
                        done = true;
                    }
                } catch (Exception ex) {
                    // fallback silently
                    done = false;
                }
            }

            if (!done) {
                if (useOpenCV) {
                    // OpenCV enhancement
                    OpenCVUtils.enhanceLocal(original.toFile().getAbsolutePath(), outPath.toFile().getAbsolutePath(), 1024);
                } else {
                    // simple local upscale + unsharp mask as fallback
                    SimpleImageEnhancer.localEnhance(original.toFile(), outPath.toFile(), 1024);
                }
            }

            t.setEnhancedPath(outName);
            textureRepository.save(t);
            return Optional.of(t);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Optional.empty();
        }
    }

    private byte[] callExternalProvider(File inputFile) {
        // Placeholder for external AI provider integration.
        // The implementation POSTs image bytes to `aiProviderUrl` and expects raw image bytes in response.
        // If you configure an external provider, set `app.texture.ai.provider-url` in application.properties.
        return null;
    }
}
