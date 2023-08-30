import clsx from 'clsx';

export interface ToggleOption<T = unknown> {
  label: string;
  value: T;
}

export interface ToggleProps<T> {
  selected: T;
  options: ToggleOption<T>[];
  backgroundColour?: string;
  onChange: (item: ToggleOption<T>) => void;
}

export function Toggle<T extends string | number | boolean>({
  backgroundColour = 'bg-purple-500',
  options,
  selected,
  onChange,
}: ToggleProps<T>) {
  return (
    <div className="inline-flex items-center overflow-hidden select-none bg-black text-gray-400 rounded-full">
      {options.map((item) => {
        const active = item.value === selected;
        const classes = clsx(
          'rounded-full px-4 py-1 text-sm cursor-pointer h-full',
          active ? 'text-white' : 'hover:bg-dark-200',
          active && backgroundColour
        );

        return (
          <button
            type="button"
            key={item.value.toString()}
            className={classes}
            onClick={() => {
              onChange(item);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
