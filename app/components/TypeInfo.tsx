import { TypeAnimation } from 'react-type-animation';

export const TypeInfo = () => {
  return (
    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'Remix',
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        'Remix Express ',
        1000,
        'Remix Express Node Cron',
        1000,
        'Remix Express Node Cron Mananger',
        1000
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: '2em', display: 'inline-block' }}
      repeat={Infinity}
    />
  );
};
