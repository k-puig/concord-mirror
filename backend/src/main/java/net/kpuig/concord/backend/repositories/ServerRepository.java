package net.kpuig.concord.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.kpuig.concord.backend.datamodels.Server;

@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {
    
}
