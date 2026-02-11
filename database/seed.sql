-- ============================================
-- SEED DATA (OPTIONAL)
-- Demo content for testing and development
-- ============================================

-- ============================================
-- DEMO BLOG POSTS
-- ============================================

INSERT INTO blogs (id, slug, title, date, category, image, excerpt, content, likes) VALUES

('blog-react-hooks-2024', 'mastering-react-hooks-2024', 'Mastering React Hooks in 2024', '2024-01-15', 'React', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop', 'A comprehensive guide to React Hooks including useState, useEffect, and custom hooks with real-world examples.', '# Mastering React Hooks in 2024

React Hooks have revolutionized the way we write React components. In this comprehensive guide, we''ll explore the most important hooks and how to use them effectively.

## useState Hook

The `useState` hook is the foundation of state management in functional components:

```javascript
const [count, setCount] = useState(0);
```

## useEffect Hook

Handle side effects with the `useEffect` hook:

```javascript
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

## Custom Hooks

Create reusable logic with custom hooks:

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  
  return [value, setValue];
}
```

## Conclusion

React Hooks make your code cleaner, more reusable, and easier to test. Start using them today!', 42),

('blog-nextjs-performance', 'nextjs-performance-optimization', 'Next.js Performance Optimization Tips', '2024-01-20', 'Web Development', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop', 'Learn how to optimize your Next.js applications for maximum performance with these proven techniques.', '# Next.js Performance Optimization Tips

Performance is crucial for user experience and SEO. Here are the best practices for optimizing your Next.js applications.

## Image Optimization

Use the Next.js Image component for automatic optimization:

```javascript
import Image from ''next/image'';

<Image 
  src="/hero.jpg" 
  width={800} 
  height={400} 
  alt="Hero" 
  priority 
/>
```

## Code Splitting

Next.js automatically code-splits your pages. For components, use dynamic imports:

```javascript
const DynamicComponent = dynamic(() => import(''./Component''), {
  loading: () => <p>Loading...</p>
});
```

## Static Generation

Use `getStaticProps` for pages that can be pre-rendered:

```javascript
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data } };
}
```

## Conclusion

These optimizations will significantly improve your Next.js app performance!', 38),

('blog-tailwind-tips', 'tailwind-css-pro-tips', 'Tailwind CSS Pro Tips and Tricks', '2024-02-01', 'CSS', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop', 'Discover advanced Tailwind CSS techniques to write better, more maintainable styles.', '# Tailwind CSS Pro Tips and Tricks

Tailwind CSS is powerful, but these tips will take your skills to the next level.

## Custom Utilities

Create custom utilities in your config:

```javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        ''128'': ''32rem'',
      }
    }
  }
}
```

## Responsive Design

Use responsive prefixes effectively:

```html
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

## Dark Mode

Implement dark mode easily:

```html
<div class="bg-white dark:bg-gray-900">
  Content
</div>
```

## Conclusion

Master these techniques to become a Tailwind CSS pro!', 35),

('blog-typescript-best-practices', 'typescript-best-practices-2024', 'TypeScript Best Practices for 2024', '2024-02-10', 'Programming', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop', 'Essential TypeScript best practices every developer should follow for cleaner, safer code.', '# TypeScript Best Practices for 2024

TypeScript helps catch errors early. Follow these best practices for maximum benefit.

## Use Strict Mode

Enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Avoid Any

Use specific types instead of `any`:

```typescript
// Bad
function process(data: any) { }

// Good
function process(data: User) { }
```

## Use Type Guards

Create type guards for runtime checks:

```typescript
function isUser(obj: any): obj is User {
  return ''name'' in obj && ''email'' in obj;
}
```

## Conclusion

These practices will make your TypeScript code more robust and maintainable!', 45),

('blog-web-accessibility', 'web-accessibility-guide', 'Complete Guide to Web Accessibility', '2024-02-15', 'Web Development', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop', 'Make your websites accessible to everyone with this comprehensive accessibility guide.', '# Complete Guide to Web Accessibility

Web accessibility ensures everyone can use your website. Here''s how to implement it.

## Semantic HTML

Use proper HTML elements:

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
```

## ARIA Labels

Add ARIA labels for screen readers:

```html
<button aria-label="Close menu">
  <X />
</button>
```

## Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```javascript
<button onKeyDown={(e) => {
  if (e.key === ''Enter'') handleClick();
}}>
  Click me
</button>
```

## Conclusion

Accessibility is not optional - it''s essential for inclusive web development!', 28);

-- ============================================
-- DEMO PROJECTS
-- ============================================

INSERT INTO projects (year, type, title_part1, title_part2, image_src, image_alt, gradient_class, ai_powered, tech_icons, likes, github_url, demo_url, description) VALUES

(2024, 'FULL STACK', 'E-Commerce', 'PLATFORM', 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=500&fit=crop', 'E-commerce platform screenshot', 'gradient-card-1', true, ARRAY['⚛️', '🟢', '💎', '🗄️', '🔐'], 156, 'https://github.com/yourusername/ecommerce-platform', 'https://ecommerce-demo.vercel.app', 'A modern e-commerce platform with real-time inventory management, secure payment processing, and advanced analytics.'),

(2024, 'FULL STACK', 'Social Media', 'DASHBOARD', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop', 'Social media dashboard', 'gradient-card-2', true, ARRAY['⚛️', '🔥', '📊', '🎨', '🚀'], 142, 'https://github.com/yourusername/social-dashboard', 'https://social-dashboard-demo.vercel.app', 'Comprehensive social media management dashboard with analytics, scheduling, and multi-platform integration.'),

(2023, 'React JS', 'Task Management', 'APP', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop', 'Task management application', 'gradient-card-3', false, ARRAY['⚛️', '🎯', '📝', '✅'], 128, 'https://github.com/yourusername/task-manager', 'https://task-manager-demo.vercel.app', 'Collaborative task management application with real-time updates, team collaboration features, and project tracking.'),

(2023, 'FULL STACK', 'Real-Time Chat', 'APPLICATION', 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=500&fit=crop', 'Real-time chat interface', 'gradient-card-4', false, ARRAY['⚛️', '🔌', '💬', '🟢', '🔐'], 134, 'https://github.com/yourusername/chat-app', 'https://chat-app-demo.vercel.app', 'Real-time chat application with end-to-end encryption, file sharing, and group chat capabilities.'),

(2023, 'JavaScript', 'Weather', 'FORECAST', 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=500&fit=crop', 'Weather forecast app', 'gradient-card-5', true, ARRAY['🌤️', '📍', '📊', '🎨'], 98, 'https://github.com/yourusername/weather-app', 'https://weather-app-demo.vercel.app', 'Real-time weather forecasting application with interactive maps, severe weather alerts, and 10-day forecasts.'),

(2023, 'React JS', 'Portfolio', 'BUILDER', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop', 'Portfolio builder tool', 'gradient-card-6', false, ARRAY['⚛️', '🎨', '📱', '✨'], 112, 'https://github.com/yourusername/portfolio-builder', 'https://portfolio-builder-demo.vercel.app', 'Modern portfolio website showcasing projects, skills, and experience with smooth animations and responsive design.'),

(2024, 'FULL STACK', 'Fitness', 'TRACKER', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop', 'Fitness tracking dashboard', 'gradient-card-1', true, ARRAY['⚛️', '💪', '📊', '🔥', '🗄️'], 145, 'https://github.com/yourusername/fitness-tracker', 'https://fitness-tracker-demo.vercel.app', 'An AI-powered fitness tracking application that helps users monitor their workouts, nutrition, and progress with intelligent recommendations.'),

(2024, 'React JS', 'Recipe', 'FINDER', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=500&fit=crop', 'Recipe finder application', 'gradient-card-2', true, ARRAY['⚛️', '🍳', '🔍', '❤️'], 89, 'https://github.com/yourusername/recipe-finder', 'https://recipe-finder-demo.vercel.app', 'Recipe discovery platform with ingredient-based search, nutritional information, and meal planning features.'),

(2023, 'HTML CSS', 'Landing Page', 'TEMPLATE', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop', 'Modern landing page', 'gradient-card-3', false, ARRAY['🎨', '📱', '✨', '🚀'], 76, 'https://github.com/yourusername/landing-template', 'https://landing-template-demo.vercel.app', 'Modern landing page template with smooth animations, responsive design, and conversion-optimized layout.');

-- ============================================
-- DEMO REVIEWS
-- ============================================

INSERT INTO reviews (reviewer_name, rating, comment, date) VALUES
('Alice Wonderland', 5, 'Absolutely phenomenal work! Hridoy transformed our vision into a stunning reality. Professional, communicative, and incredibly talented. Highly recommend!', '2026-01-15'),
('Bob The Builder', 4, 'Great attention to detail and delivered the project on time. There were a few minor adjustments needed, but overall a solid experience.', '2026-02-01'),
('Charlie Chaplin', 5, 'Working with Hridoy was a delight. The UI/UX design exceeded my expectations, and the coding was super clean. Will definitely collaborate again!', '2025-12-20'),
('Diana Prince', 5, 'Hridoy is a true artist in web development. The site is not just functional but also beautiful and user-friendly. Five stars!', '2025-11-10'),
('Eve Harrington', 4, 'Responsive and skilled. The final product was very good, although communication could have been slightly more frequent at times. Still, a positive outcome.', '2025-10-25'),
('Frank Sinatra', 5, 'Simply the best! Hridoy captured the essence of what I wanted perfectly. A seamless process from start to finish.', '2025-09-05');

-- ============================================
-- VERIFICATION
-- ============================================

SELECT COUNT(*) as blog_count FROM blogs;
SELECT COUNT(*) as project_count FROM projects;
SELECT COUNT(*) as review_count FROM reviews;


-- ============================================
-- DEMO SKILLS
-- ============================================

INSERT INTO skills (name, category, icon, proficiency, display_order) VALUES
-- Frontend
('JavaScript', 'Frontend', '🟨', 5, 1),
('TypeScript', 'Frontend', '🔷', 5, 2),
('React', 'Frontend', '⚛️', 5, 3),
('Next.js', 'Frontend', '▲', 5, 4),
('Tailwind CSS', 'Frontend', '🎨', 5, 5),
('Shadcn UI', 'Frontend', '🎭', 4, 6),

-- Backend
('Node.js', 'Backend', '🟢', 5, 7),
('Express.js', 'Backend', '🚂', 4, 8),
('REST APIs', 'Backend', '🔌', 5, 9),
('GraphQL', 'Backend', '◈', 4, 10),

-- Database
('MongoDB', 'Database', '🍃', 4, 11),
('PostgreSQL', 'Database', '🐘', 4, 12),
('Supabase', 'Database', '⚡', 5, 13),

-- DevOps & Tools
('Git', 'DevOps', '📦', 5, 14),
('Docker', 'DevOps', '🐳', 4, 15),
('AWS', 'DevOps', '☁️', 3, 16),
('Vercel', 'DevOps', '▲', 5, 17);

SELECT COUNT(*) as skill_count FROM skills;
