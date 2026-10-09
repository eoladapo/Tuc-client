import { Link } from 'react-router-dom';
import {
  HiStar,
  HiClock,
  HiPlayCircle,
  HiArrowRight,
  HiOutlineSparkles,
  HiOutlineTag,
} from 'react-icons/hi2';
import { SectionHeading, Reveal } from './Primitives';
import { TiltCard } from './Motion';
import { useCourses, useCategories } from '../../hooks/useCourses';
import { formatPrice, formatRating } from '../../utils/formatters';
import { courses as copy } from '../../data/landingContent';

/** 195 → "3h 15m" */
const formatMinutes = (minutes) => {
  const total = Number(minutes) || 0;
  if (total <= 0) return null;
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-secondary-200 bg-white">
    <div className="h-44 animate-pulse bg-secondary-100" />
    <div className="space-y-3 p-6">
      <div className="h-5 w-3/4 animate-pulse rounded bg-secondary-100" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-secondary-100" />
      <div className="h-9 w-full animate-pulse rounded bg-secondary-100" />
    </div>
  </div>
);

const CourseCard = ({ course }) => {
  const isFree = course.isFree || !course.price;
  const duration = formatMinutes(course.durationMinutes);
  const categoryName = course.category?.name;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white transition-all duration-300 hover:border-primary-200 hover:shadow-brand">
      {/* Thumbnail — real image when the course has one, brand gradient otherwise */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900">
            <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-25" />
            <HiPlayCircle className="relative h-14 w-14 text-white/80 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}

        {isFree && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700 shadow-sm">
            Free
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {categoryName && (
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">
            {categoryName}
          </span>
        )}

        <h3 className="mt-2 text-lg font-bold leading-snug text-secondary-900">{course.title}</h3>

        {(course.shortDescription || course.description) && (
          <p className="mt-2.5 line-clamp-2 text-base leading-relaxed text-secondary-600">
            {course.shortDescription || course.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary-500">
          {duration && (
            <span className="inline-flex items-center gap-1.5">
              <HiClock className="h-4 w-4" />
              {duration}
            </span>
          )}
          {course.totalReviews > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <HiStar className="h-4 w-4 text-accent-500" />
              <span className="font-bold text-secondary-900">
                {formatRating(course.averageRating)}
              </span>
              <span>({course.totalReviews})</span>
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between border-t border-secondary-100 pt-5">
            <span className="text-xl font-extrabold tracking-tight text-secondary-900">
              {isFree ? 'Free' : formatPrice(course.price)}
            </span>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700"
            >
              {isFree ? 'Start' : 'Enrol'}
              <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

/** Full-width panel shown when the catalogue is empty or the API is unreachable. */
const CataloguePlaceholder = () => (
  <div className="rounded-3xl border border-dashed border-primary-200 bg-primary-50/50 px-8 py-14 text-center">
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm">
      <HiOutlineSparkles className="h-7 w-7" />
    </span>
    <h3 className="mt-5 text-xl font-bold text-secondary-900">{copy.emptyTitle}</h3>
    <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-secondary-600">
      {copy.emptyBody}
    </p>
    <Link
      to={copy.cta.href}
      className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-base font-bold text-white shadow-brand transition-colors hover:bg-primary-700"
    >
      {copy.cta.label}
      <HiArrowRight className="h-4 w-4" />
    </Link>
  </div>
);

const Courses = () => {
  // Public endpoints (optionalAuth) — no session required to read the catalogue.
  const { data: coursesData, isLoading } = useCourses({ limit: 3, page: 1 });
  const { data: categoriesData } = useCategories();

  const liveCourses = coursesData?.data?.courses || [];
  const categories = categoriesData?.data?.categories || [];

  return (
    <section id="courses" className="section-y scroll-mt-20 bg-secondary-50">
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          subheading={copy.subheading}
        />

        {/* Course grid */}
        <div className="mt-14">
          {isLoading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : liveCourses.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {liveCourses.slice(0, 3).map((course, i) => (
                <Reveal key={course.id} delay={i * 0.08}>
                  <TiltCard>
                    <CourseCard course={course} />
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal once>
              <CataloguePlaceholder />
            </Reveal>
          )}
        </div>

        {/* Real categories from the API */}
        {categories.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-16 border-t border-secondary-200 pt-12">
              <p className="eyebrow justify-center">{copy.categoriesEyebrow}</p>
              <h3 className="mt-3 text-center text-2xl font-extrabold tracking-tight text-secondary-900">
                {copy.categoriesHeading}
              </h3>

              <ul className="mt-7 flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to="/login"
                      className="group inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-5 py-2.5 text-base font-semibold text-secondary-700 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-700 hover:shadow-soft"
                    >
                      <HiOutlineTag className="h-4 w-4 text-primary-500 transition-transform group-hover:scale-110" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {/* Catalogue CTA */}
        <Reveal delay={0.14}>
          <div className="mt-12 text-center">
            <Link
              to={copy.browseCta.href}
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-secondary-300 bg-white px-7 py-3.5 text-lg font-semibold text-secondary-800 transition-all hover:border-primary-400 hover:text-primary-700"
            >
              {copy.browseCta.label}
              <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Courses;
