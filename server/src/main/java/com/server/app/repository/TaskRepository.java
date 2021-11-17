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

    @Query("SELECT t FROM Task t WHERE app_user_id =:USER_ID AND t.id=:ID AND t.deleted=false")
    Optional<Task> findAvailableTaskByUserIdAndTaskId(@Param("USER_ID")Long userId, @Param("ID")Long taskId);

    @Query("SELECT t FROM Task t WHERE app_user_id =:USER_ID AND t.deleted=false")
    List<Task> findAvailableTasksByUserId(@Param("USER_ID")Long userId);

    @Query("SELECT t FROM Task t WHERE app_user_id =:USER_ID AND t.deleted=false AND done=true")
    List<Task> findAvailableTasksByUserIdDone(@Param("USER_ID")Long userId);

    @Query("SELECT t FROM Task t WHERE app_user_id =:USER_ID AND t.deleted=false AND done=false")
    List<Task> findAvailableTasksByUserIdTodo(@Param("USER_ID")Long userId);
}
