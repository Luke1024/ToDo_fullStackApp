package com.server.app.repository;

import com.server.app.domain.AppSession;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends CrudRepository<AppSession, Long> {

    @Query("SELECT s FROM AppSession s WHERE s.token=:TOKEN")
    Optional<AppSession> findSessionByToken(@Param("TOKEN")String token);
}
