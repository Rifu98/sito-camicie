package it.sitocamicie.repository;

import it.sitocamicie.model.ComponentModel;
import it.sitocamicie.model.ShirtComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComponentModelRepository extends JpaRepository<ComponentModel, Long> {
    List<ComponentModel> findByComponentType(ShirtComponent type);
}
