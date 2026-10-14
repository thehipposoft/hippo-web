'use client'
import Image from 'next/image';
import React, { useRef } from 'react';
import { gsap } from 'gsap';


const LogofolioGallery = ({ images, vc }: { images: string[]; vc: string[] }) => {

    const container = useRef<HTMLDivElement>(null);

    const slideTo = (x: string) => {
        if (!container.current) return;
        const q = gsap.utils.selector(container.current);
        gsap.to(q('.gallery__wrapper > *'), { x, duration: .7, ease: 'power2.inOut' });
    };

    const onClickOne = () => slideTo('-100%');
    const onClickTwo = () => slideTo('-200%');
    const onClickThree = () => slideTo('-300%');
    const onClickFour = () => slideTo('0');

    return (
        <div ref={container}>
            <div className='gallery__wrapper origin-top flex relative overflow-hidden mx-auto rounded-md'>
                <div className='md:min-w-[450px] lg:min-w-[375px] min-w-[80vw] md:h-[550px] h-[450px] relative group cursor-pointer' onClick={onClickOne}>
                    <Image sizes="(max-width: 768px) 80vw, (max-width: 1200px) 450px, 375px" src={images[0]} alt='Gallery first image' fill className='object-cover' />
                    <svg className='absolute right-4 bottom-4 z-10 duration-500 group-hover:rotate-180 group-hover:scale-110' width="45" height="45" viewBox="0 0 40 40" fill="" xmlns="http://www.w3.org/2000/svg"  >
                        <path d="M1.25 20H38.75" stroke={`${vc[0]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                        <path d="M20 1.25V38.75" stroke={`${vc[0]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                    </svg>
                </div>
                <div className='md:min-w-[450px] lg:min-w-[375px] min-w-[80vw] md:h-[550px] h-[450px] relative group cursor-pointer' onClick={onClickTwo}>
                    <Image sizes="(max-width: 768px) 80vw, (max-width: 1200px) 450px, 375px" src={images[1]} alt='Gallery second image' fill className='object-cover' />
                    <svg className='absolute right-4 bottom-4 z-10 duration-500 group-hover:rotate-180 group-hover:scale-110' width="45" height="45" viewBox="0 0 40 40" fill="" xmlns="http://www.w3.org/2000/svg"  >
                        <path d="M1.25 20H38.75" stroke={`${vc[1]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                        <path d="M20 1.25V38.75" stroke={`${vc[1]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                    </svg>
                </div>
                <div className='md:min-w-[450px] lg:min-w-[375px] min-w-[80vw] md:h-[550px] h-[450px] relative group cursor-pointer' onClick={onClickThree}>
                    <Image sizes="(max-width: 768px) 80vw, (max-width: 1200px) 450px, 375px" src={images[2]} alt='Gallery third image' fill className='object-cover' />
                    <svg className='absolute right-4  bottom-4 z-10 duration-500 group-hover:rotate-180 group-hover:scale-110' width="45" height="45" viewBox="0 0 40 40" fill="" xmlns="http://www.w3.org/2000/svg"  >
                        <path d="M1.25 20H38.75" stroke={`${vc[2]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                        <path d="M20 1.25V38.75" stroke={`${vc[2]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                    </svg>
                </div>
                <div className='md:min-w-[450px] lg:min-w-[375px] min-w-[80vw] md:h-[550px] h-[450px] relative group cursor-pointer' onClick={onClickFour}>
                    <Image sizes="(max-width: 768px) 80vw, (max-width: 1200px) 450px, 375px" src={images[3]} alt='Gallery fourth image' fill className='object-cover' />
                    <svg className='absolute right-4 bottom-4 z-10 duration-500 group-hover:rotate-180 group-hover:scale-110' width="45" height="45" viewBox="0 0 40 40" fill="" xmlns="http://www.w3.org/2000/svg"  >
                        <path d="M1.25 20H38.75" stroke={`${vc[3]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                        <path d="M20 1.25V38.75" stroke={`${vc[3]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default LogofolioGallery;