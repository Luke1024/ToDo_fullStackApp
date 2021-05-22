package com.server.app.repository;

import com.server.app.domain.Session;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends CrudRepository<Session, Long> {

    @Query
    Optional<Session> findSessionByToken(@Param("TOKEN")String token);
}
