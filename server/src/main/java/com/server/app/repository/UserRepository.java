package com.server.app.repository;

import com.server.app.domain.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    @Query
    Optional<User> findLoggedUserByToken(@Param("TOKEN")String token);

    @Query
    Optional<User> findUserByEmailAndPassword(@Param("EMAIL")String email,
                                              @Param("PASSWORD")String password);
}