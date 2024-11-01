import axios from 'axios';
import { useState, useEffect } from "react";
import './App.css'
import { PODCAST_ID, CUT_SENTENCE, ALERT_MESSAGE } from './constants';
import { Episode } from './types/episode'

function App() {
  const [recoEpisode, setRecoEpisode] = useState(-1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

  useEffect(() => {
    const getSpotifyToken = async ():Promise<string> =>  {
      const tokenResponse = await axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: 'grant_type=client_credentials',
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
          }
      });
      
      return tokenResponse.data.access_token;
    }

    const getAllEpisodes = async (podcastId: string) => {
      try {
        const token = await getSpotifyToken();
        const episodes: Episode[] = [];
        let offset = 0;
        const limit = 50;
    
        while (true) {
          const response = await axios({
            method: 'get',
            url: `https://api.spotify.com/v1/shows/${podcastId}/episodes`,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              limit: limit,
              offset: offset
            }
          });
    
          episodes.push(...response.data.items as Episode[]);
    
          if (response.data.items.length < limit) {
            break;
          }
    
          offset += limit;
        }
        setEpisodes(episodes);
      } catch (error) {
        console.error(error);
        alert(ALERT_MESSAGE)
      } finally {
        setIsLoading(false);
      }
    }
    
    getAllEpisodes(PODCAST_ID);
  }, []);

  const makeRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const onClick = () => {
    setRecoEpisode(makeRandomNumber(0, episodes.length-1));
  }
  
  const textStyle = "text-2xl text-gray-800"
  const episodeTitleStyle = `${textStyle} font-semibold underline`

  return (
    <>
      <div className="bg-gray-100 h-screen">
        <div className="bg-rose-500 sticky top-0 h-15 p-2 text-xl font-serif">
          <h1 className="text-gray-900 font-semibold italic">OVER THE SUN エピソードみくじ</h1>
        </div>
        <div className="flex items-center justify-center p-2 h-80 font-mono">
          {isLoading ? 
            <div className={textStyle}>Loading...</div>
            :
              <>
                <div className="flex flex-col items-center space-y-6">
                  <p className={textStyle}>あなたへのおすすめは... </p>
                  { recoEpisode >= 0 &&
                      <a
                        href={episodes[recoEpisode].external_urls.spotify}
                        target="_blank"
                        className={episodeTitleStyle}
                      >
                        {episodes[recoEpisode].name} {episodes[recoEpisode].description.replace(CUT_SENTENCE, "")}
                      </a>
                  }
                  <button className="px-4 py-2 bg-red-300 border border-red-300 text-white rounded-md hover:text-red-300 hover:bg-white" onClick={onClick}>Click Me</button>
                </div>
              </>
            }
        </div>
      </div>
    </>
  )
}

export default App