package it.sitocamicie.controller;

import it.sitocamicie.model.UserAccount;
import it.sitocamicie.repository.UserAccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserAccountRepository repo;
    private final PasswordEncoder encoder;

    public UserController(UserAccountRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @GetMapping
    public List<UserAccount> list() { return repo.findAll(); }

    @PostMapping
    public UserAccount create(@RequestBody UserAccount u) {
        u.setPassword(encoder.encode(u.getPassword()));
        return repo.save(u);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repo.findById(id).map(r -> { repo.delete(r); return ResponseEntity.noContent().build(); }).orElse(ResponseEntity.notFound().build());
    }
}
