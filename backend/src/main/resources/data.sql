-- seed sample component models (placeholders)
INSERT INTO component_models (name, component_type, file_path, metadata) VALUES
('Collar - Italiano','COLLAR','samples/sample-1.glb','{}'),
('Cuff - Semplice','CUFF','samples/sample-2.glb','{}');

-- seed sample textures (placeholders)
INSERT INTO textures (name, original_path, processed_path, thumbnail_path, is_tillable) VALUES
('Sample fabric','sample.jpg','processed_sample.png','thumb_sample.png', true);
