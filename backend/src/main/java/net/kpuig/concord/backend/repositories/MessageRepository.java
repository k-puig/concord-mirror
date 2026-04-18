package net.kpuig.concord.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.kpuig.concord.backend.datamodels.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
}
