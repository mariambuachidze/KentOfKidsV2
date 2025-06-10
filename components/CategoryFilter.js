'use client';

export default function CategoryFilter({ categories, selectedCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 rounded-full text-sm ${
          selectedCategory === 'all'
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Tümü
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id.toString())}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === category.id.toString()
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
