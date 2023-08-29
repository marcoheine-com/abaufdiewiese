import {Disclosure} from '@headlessui/react';
import MinusIcon from '~/components/icons/Minus';
import PlusIcon from '~/components/icons/Plus';
import PortableText from '~/components/portableText/PortableText';
import type {SanityModuleAccordion} from '~/lib/sanity';

type Props = {
  className?: string;
  value: SanityModuleAccordion;
};

export default function AccordionBlock({className, value}: Props) {
  const renderTitleAsURL = (title: string) => {
    const titleWithoutQuestionmark = title.replace(/\?/g, '');
    return titleWithoutQuestionmark.toLowerCase().replace(/\s/g, '-');
  };
  return (
    <div className={`first:mt-0 last:mb-0 my-8 ${className}`}>
      {value?.groups?.map((group) => (
        <Disclosure key={group._key}>
          {({open}: {open: boolean}) => (
            <div className="flex flex-col border-b border-b-gray">
              <Disclosure.Button
                className={
                  'flex items-center justify-between py-4 text-lg font-bold transition-opacity duration-200 ease-out hover:opacity-60'
                }
              >
                <h2 className="text-start" id={renderTitleAsURL(group.title)}>
                  {group.title}
                </h2>
                <div className="ml-4 shrink-0">
                  {open ? <MinusIcon /> : <PlusIcon />}
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="pb-4 text-md">
                <PortableText value={group.body} />
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
