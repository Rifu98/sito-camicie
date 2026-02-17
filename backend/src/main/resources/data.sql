-- seed sample component models (placeholders)
INSERT INTO component_models (name, component_type, file_path, metadata) VALUES
('Collar - Italiano','COLLAR','dummy_collar.glb','{}'),
('Cuff - Semplice','CUFF','dummy_cuff.glb','{}');

-- seed sample textures (placeholders)
INSERT INTO textures (name, original_path, processed_path, thumbnail_path, is_tillable) VALUES
('Sample fabric','sample.jpg','processed_sample.jpg','thumb_sample.jpg', true);
