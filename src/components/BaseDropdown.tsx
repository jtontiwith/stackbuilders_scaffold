/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import Calendar from './Calendar'
import useCalendarDates from '../../hooks/useCalendarDates'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const { handleSuggestedDate } = useCalendarDates()
  const suggestedDates = [
    { in_one_week: 'One Week From Today' },
    { in_one_month: 'One Month From Today' },
    { end_of_month: 'End of Month' },
    { end_of_quarter: 'End of Quarter' },
  ]

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <CalendarIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 divide-y divide-gray-100 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-80">
          <div className="py-1">
            {suggestedDates.map((d, i) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <a
                    onClick={() => handleSuggestedDate(Object.keys(d))}
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    {Object.values(d)}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
          <div className="divide-y divide-gray-100 px-4 py-2 text-sm">
            <Calendar />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
