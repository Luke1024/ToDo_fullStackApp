package com.server.app.repository;

import com.server.app.domain.AppUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<AppUser, Long> {

    @Query("SELECT u FROM AppUser u WHERE u.userEmail=:EMAIL")
    Optional<AppUser> findByEmail(@Param("EMAIL")String email);

    @Query("SELECT u FROM AppUser u WHERE u.userEmail=:EMAIL AND u.password=:PASSWORD")
    Optional<AppUser> findUserByEmailAndPassword(@Param("EMAIL") String email, @Param("PASSWORD") String password);
}
