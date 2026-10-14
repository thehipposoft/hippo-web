import type { ReactNode } from 'react';
import Image from 'next/image';
import LogofolioGallery from './LogofolioGallery';
import Link from 'next/link';

export type LogofolioSingleData = {
    name: string;
    category?: boolean;
    isOld?: boolean;
    gallery?: string[];
    vectorColors?: string[];
    description?: string[];
    client?: string;
    instagram?: string;
    concept?: string | string[];
    content?: ReactNode;
    country: string;
    date: string;
    href?: string;
    logo?: string;
    logoSizes?: string[];
};

const LogofolioSingleComp = ({ data }: { data: LogofolioSingleData }) => {
    return (
        <div className='flex flex-col lg:h-screen text-black lg:gap-12 relative bg-white z-20'>
            <div className='flex justify-between pt-20 lg:pt-12 2xl:pt-16 lg:w-[1300px] w-[85vw] mx-auto'>
                {
                    data.category && <h2 className='lg:text-[54px] w-3/4 text-4xl'>{data.name}</h2>
                }
                {
                    data.isOld && <h2 className='lg:text-[54px] w-3/4 text-4xl'>{data.name}</h2>
                }
                {
                    data.isOld &&
                            <div className='flex items-center gap-8'>
                                <h4 className='text-base hidden md:block'>Logofolio</h4>
                            </div>
                }
                {
                    data.category &&
                    <div className='flex items-center gap-4'>
                        <p className='hidden md:block'>Social Media</p>
                    </div>
                }
            </div>
            <div className='lg:w-[1300px] w-[80vw] my-4 md:mt-8 mx-auto min-h-[600px] 2xl:min-h-[700px] 2xl:m-auto flex flex-col-reverse lg:flex-row justify-between md:gap-2 gap-14'>
                <div className='lg:w-[375px] md:w-[450px] w-[80vw] lg:h-[550px] md:my-12 md:mx-auto lg:mx-0 lg:my-0'>
                    <LogofolioGallery images={data.gallery ?? []} vc={data.vectorColors ?? []} />
                </div>
                <div className='flex flex-col lg:h-[550px] justify-between'>
                    <div className='flex flex-col gap-2 text-sm md:w-[460px]'>
                        <p>{data.description?.[0]}</p>
                        <p>{data.description?.[1]}</p>
                        <p>{data.description?.[2]}</p>
                    </div>
                    <div>
                        <div className='font-black md:w-[460px] text-sm pt-6'>
                            {
                                data.client ?
                                <div>
                                    <p>Client:</p>
                                    <p>{data.client}</p>
                                    <p>We invite you to check out their Instagram profile <Link href={data.instagram ?? ''} target='_blank' rel='noreferrer' className='underline bold'>here!</Link></p>
                                </div>
                                :
                                <div>
                                    <h4>Concept:</h4>
                                    {
                                        data.concept && data.concept.length > 1 ?
                                        <div>
                                            <h4>{data.concept?.[0]}</h4>
                                            <h4>{data.concept?.[1]}</h4>
                                        </div>
                                        :
                                        <h4>{data.concept}</h4>

                                    }
                                </div>
                            }

                        </div>
                        <div>
                            {data.content}
                        </div>
                    </div>
                </div>
                <div className='flex lg:flex-col flex-col-reverse gap-6 justify-between lg:h-[350px] mt-8 md:mb-8 lg:my-0'>
                    <div className='uppercase text-[15px] flex flex-col lg:items-end md:gap-1 gap-4'>
                        <h3 className='light uppercase'>{data.name}</h3>
                        <h3 className='light uppercase'>{data.country}</h3>
                        <h3 className='light uppercase'>{data.date}</h3>
                        <Link href={data.href ?? ''} target='_blank' rel='noreferrer' className={`${data.href === '' ? 'hidden' : ''} relative z-10 mt-2 overflow-hidden duration-500 px-4 tracking-[0.2em] text-xs py-2 border-cyan border-2 text-black w-fit rounded-3xl hover:bg-cyan hover:scale-x-105 uppercase`}>
                               Discover Site
                        </Link>
                        {
                            data.category
                            ? <Link href={data.instagram ?? ''} rel='noreferrer' target='_blank' className='flex w-fit mt-6'>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)" stroke="#41EAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z"/><path d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>
                            </Link>
                            : <></>
                        }
                    </div>
                    {
                        data.logo ?
                        <div className={`relative w-[${data.logoSizes?.[0]}] h-[${data.logoSizes?.[1]}]`}>
                            <Image sizes={data.logoSizes?.[0]} src={data.logo} alt={`${data.name} logo`} fill className='object-contain' />
                        </div>
                        :
                        <></>
                    }
                </div>
            </div>
        </div>
    );
};

export default LogofolioSingleComp;