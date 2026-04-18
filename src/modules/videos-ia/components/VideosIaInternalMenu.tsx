import React from 'react';

interface VideosIaInternalMenuProps {
  sections: string[];
}

const VideosIaInternalMenu: React.FC<VideosIaInternalMenuProps> = ({ sections }) => {
  return (
    <nav className="flex flex-wrap gap-2">
      {sections.map((section) => (
        <span
          key={section}
          className="px-2 py-1 rounded-md text-[12px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {section}
        </span>
      ))}
    </nav>
  );
};

export default VideosIaInternalMenu;
