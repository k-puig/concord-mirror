package net.kpuig.shoebill.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.kpuig.shoebill.backend.datamodels.message.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
}
