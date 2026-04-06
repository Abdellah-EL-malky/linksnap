package com.linksnap.repository;
import com.linksnap.entity.ShortLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
public interface ShortLinkRepository extends JpaRepository<ShortLink, Long> {
    Optional<ShortLink> findByShortCode(String shortCode);
    List<ShortLink> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByShortCode(String shortCode);
    @Query("SELECT COUNT(s) FROM ShortLink s WHERE s.user.id = :userId") Long countByUserId(@Param("userId") Long userId);
}
