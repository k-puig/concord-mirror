package net.kpuig.shoebill.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.kpuig.shoebill.backend.datamodels.server.Server;

@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {
    
}
