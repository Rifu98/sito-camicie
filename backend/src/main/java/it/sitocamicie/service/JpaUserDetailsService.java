package it.sitocamicie.service;

import it.sitocamicie.model.UserAccount;
import it.sitocamicie.repository.UserAccountRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    private final UserAccountRepository repo;

    public JpaUserDetailsService(UserAccountRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount ua = repo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
        Collection<GrantedAuthority> auths = Arrays.stream((ua.getRoles() == null ? "ROLE_USER" : ua.getRoles()).split(","))
                .map(String::trim).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
        return org.springframework.security.core.userdetails.User.withUsername(ua.getUsername())
                .password(ua.getPassword()).authorities(auths).disabled(!ua.isEnabled()).build();
    }
}
