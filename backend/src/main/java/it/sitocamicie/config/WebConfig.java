package it.sitocamicie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins("http://localhost:4200").allowedMethods("GET","POST","PUT","DELETE");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from storage directory under /files/**
        String storagePath = Paths.get("storage").toUri().toString();
        registry.addResourceHandler("/files/**")
                .addResourceLocations(storagePath)
                .setCachePeriod(3600 * 24 * 30); // 30 days
    }
}
