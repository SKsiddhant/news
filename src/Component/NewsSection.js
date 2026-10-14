import React, { useState, useEffect, useCallback } from 'react'
import News from './News';
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { fetchHeadlines } from '../api';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function NewsSection(props) {
    const { setProgress, apiKey, country, category, pageSize } = props;
    const [articles, setArticles] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [demo, setDemo] = useState(false)
    const [totalResults, setTotalResults] = useState(0)

    const load = useCallback(async (pageToLoad, signal) => {
        const data = await fetchHeadlines({ country, category, page: pageToLoad, pageSize, apiKey, signal });
        setDemo(data.demo);
        setTotalResults(data.totalResults);
        // the API can repeat an article across pages; keep the first copy of each url
        setArticles((prev) => {
            const seen = new Set(prev.map((a) => a.url));
            return prev.concat(data.articles.filter((a) => a.url && !seen.has(a.url)));
        });
    }, [apiKey, country, category, pageSize]);

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(category)} - NewsHub`;
        const controller = new AbortController();
        setProgress(10);
        setLoading(true);
        load(1, controller.signal)
            .catch((e) => { if (e.name !== 'AbortError') setError(e.message); })
            .finally(() => { if (!controller.signal.aborted) { setLoading(false); setProgress(100); } });
        return () => controller.abort();
    }, [load, category, setProgress]);

    const fetchMoreData = async () => {
        const next = page + 1;
        try {
            await load(next);
            setPage(next);
        } catch (e) {
            setError(e.message);
        }
    }

    const dark = props.mode === 'dark';
    return (
        <div className={`${dark ? 'bg-[#1F1D36] text-white' : 'bg-[#FDEFEF] text-black'} pt-20 md:pt-24  w-full min-h-screen pb-6`}>
            <div className={`pt-4 text-center text-3xl md:text-6xl font-bold ${dark ? 'text-amber-400' : 'text-red-600'}`}>
                <span className='mb-4'>NewsHub </span>
                <span className={`${dark ? 'text-red-400' : ' text-blue-700'}`}>{capitalizeFirstLetter(category)}</span>
                <h1 className={`${dark ? 'text-pink-500' : ' text-violet-600'} text-xl md:text-2xl mt-2`}>"सबसे तेज़ सबसे आगे"</h1>
            </div>

            {demo && (
                <p role="note" className="text-center text-sm mt-2 text-amber-500">
                    Showing sample articles (set REACT_APP_NEWS_API to load live {category} news).
                </p>
            )}
            {error && <p role="alert" className="text-center text-red-500 mt-4">Could not load news: {error}</p>}
            {loading && <Spinner />}
            {!loading && !error && articles.length === 0 && (
                <p className="text-center mt-8">No articles found.</p>
            )}

            <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={!loading && !error && articles.length < totalResults} loader={<Spinner />}>
                <div className='pt-6 flex gap-12 flex-wrap justify-center mt-6 mb-16'>
                    {articles.map((element) => (
                        <News key={element.url} mode={props.mode} title={element.title || ""} description={element.description || ""} imageUrl={element.urlToImage} url={element.url} source={element.source?.name || ""} author={element.author} date={element.publishedAt} />
                    ))}
                </div>
            </InfiniteScroll>

            <div className={`${dark ? 'bg-[#1A1A2E] border-t border-gray-600 text-white' : 'bg-[#FFF8F3] border-t border-red-200 text-black'} w-full fixed bottom-0 text-center p-2 font-serif text-xs md:text-sm`}>
                <span>Copyright &#169;2022 NewsHub all rights reserved on behalf of @HarshSingh</span>
                <div className='hidden md:inline-block float-right mr-16 space-x-4'>
                    <a href="https://github.com/H4rshSingh" aria-label="GitHub"><GitHubIcon /></a>
                    <a href="https://twitter.com/H4rshSingh" aria-label="Twitter"><TwitterIcon /></a>
                    <a href="https://www.linkedin.com/in/h4rshsingh" aria-label="LinkedIn"><LinkedInIcon /></a>
                </div>
            </div>
        </div>
    )
}

NewsSection.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

NewsSection.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string,
    setProgress: PropTypes.func.isRequired,
}
export default NewsSection;
