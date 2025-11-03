package adj.demo.sguserver.modules.user.service;

import adj.demo.sguserver.modules.user.model.User;
import adj.demo.sguserver.modules.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(long id) {
        return userRepository.findById(id);
    }

    public User save (User user) {
        userRepository.findByEmail(user.getEmail()).ifPresent( u -> {
            throw new IllegalArgumentException("El correo no se puede repetir");
        });
        return userRepository.save(user);
    }

    public User update(Long id, User payload) {
        return userRepository.findById(id).map(existing -> {
            existing.setName(payload.getName());
            existing.setEmail(payload.getEmail());
            existing.setPhone(payload.getPhone());
            return userRepository.save(existing);
        }).orElseThrow( () -> new IllegalArgumentException("Usuario no encontrado")) ;
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        userRepository.deleteById(id);
    }
}
