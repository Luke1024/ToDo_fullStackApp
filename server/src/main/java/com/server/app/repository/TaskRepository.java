package com.server.app.repository;

import com.server.app.domain.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface TaskRepository extends CrudRepository<Task, Long>{

    @Query
    Optional<Task> findAvailableTaskByUserIdAndTaskFrontId(@Param("USER_ID")Long userId, @Param("FRONT_ID")Long taskId);

    @Query
    List<Task> findAvailableTasksByUserId(@Param("USER_ID")Long userId);
}
