package it.sitocamicie.config;

import it.sitocamicie.model.UserAccount;
import it.sitocamicie.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserAccountRepository users, PasswordEncoder encoder,
                           @Value("${app.admin.password:admin}") String adminPass) {
        return args -> {
            if (users.findByUsername("admin").isEmpty()) {
                UserAccount a = new UserAccount();
                a.setUsername("admin");
                a.setPassword(encoder.encode(adminPass));
                a.setRoles("ROLE_ADMIN");
                users.save(a);
            }
        };
    }
}
