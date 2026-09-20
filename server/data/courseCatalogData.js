/**
 * Registry of Academic & Industry Domains
 * All default domains cleared to allow adding custom domains one by one.
 */

export const COURSE_DOMAINS = [];

export function getAllCoursesFlat() {
  const list = [];
  COURSE_DOMAINS.forEach(domain => {
    (domain.courses || []).forEach(c => {
      list.push({
        ...c,
        domainId: domain.id,
        domainName: domain.name,
        domainShortName: domain.shortName,
        emoji: domain.emoji,
        gradient: domain.gradient,
        accentColor: domain.accentColor
      });
    });
  });
  return list;
}
