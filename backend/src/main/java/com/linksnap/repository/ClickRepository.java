package com.linksnap.repository;
import com.linksnap.entity.Click;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
public interface ClickRepository extends JpaRepository<Click, Long> {
    List<Click> findByShortLinkIdOrderByClickedAtDesc(Long shortLinkId);
    Long countByShortLinkId(Long shortLinkId);
    Long countByShortLinkUserId(Long userId);

    @Query("SELECT CAST(c.clickedAt AS date) as day, COUNT(c) as cnt FROM Click c WHERE c.shortLink.user.id = :userId AND c.clickedAt >= :since GROUP BY CAST(c.clickedAt AS date) ORDER BY CAST(c.clickedAt AS date)")
List<Object[]> clicksPerDayForUser(@Param("userId") Long userId, @Param("since") LocalDateTime since);

@Query("SELECT CAST(c.clickedAt AS date) as day, COUNT(c) as cnt FROM Click c WHERE c.shortLink.id = :linkId AND c.clickedAt >= :since GROUP BY CAST(c.clickedAt AS date) ORDER BY CAST(c.clickedAt AS date)")
List<Object[]> clicksPerDayForLink(@Param("linkId") Long linkId, @Param("since") LocalDateTime since);

    @Query("SELECT c.country, COUNT(c) as cnt FROM Click c WHERE c.shortLink.user.id = :userId AND c.country IS NOT NULL GROUP BY c.country ORDER BY cnt DESC")
    List<Object[]> topCountriesForUser(@Param("userId") Long userId);

    @Query("SELECT c.browser, COUNT(c) as cnt FROM Click c WHERE c.shortLink.user.id = :userId AND c.browser IS NOT NULL GROUP BY c.browser ORDER BY cnt DESC")
    List<Object[]> browsersForUser(@Param("userId") Long userId);

    @Query("SELECT c.device, COUNT(c) as cnt FROM Click c WHERE c.shortLink.user.id = :userId AND c.device IS NOT NULL GROUP BY c.device ORDER BY cnt DESC")
    List<Object[]> devicesForUser(@Param("userId") Long userId);
}
