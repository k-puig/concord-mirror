package net.kpuig.concord.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import net.kpuig.concord.backend.datamodels.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
}
