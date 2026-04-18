package net.kpuig.concord.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import net.kpuig.concord.backend.datamodels.Server;

public interface ServerRepository extends JpaRepository<Server, Long> {
    
}
