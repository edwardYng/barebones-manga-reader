import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

const mangaToData = async ({
  data: {
    id,
    attributes: {
      title: { en: title },
      description: { en: description },
      links,
    },
  },
  relationships,
}) => {
  const authorIds = relationships
    .filter(({ type }) => type === "author")
    .map(({ id }) => id);
  const artistIds = relationships
    .filter(({ type }) => type === "artist")
    .map(({ id }) => id);

  const response = await axios.get("https://api.mangadex.org/author", {
    params: {
      ids: Array.from(new Set(authorIds.concat(artistIds))),
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });

  const authorsMapping = {};
  response.data.results.forEach(
    ({
      data: {
        id,
        attributes: { name },
      },
    }) => {
      authorsMapping[id] = name;
    }
  );

  const author = authorIds.map((id) => authorsMapping[id]);
  const artist = artistIds.map((id) => authorsMapping[id]);

  const coverResponse = await axios.get(
    `https://api.mangadex.org/cover?order[volume]=asc`,
    {
      params: {
        manga: [id],
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    }
  );

  const coverFileName = coverResponse.data.results[0].data.attributes.fileName;

  return {
    id,
    title: title,
    description: description.split(/\[.+?\]/)[0],
    rating: { bayesian: 0 },
    views: 0,
    author,
    artist,
    coverFileName,
    links,
  };
};

const GetManga = (mangaID) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaInfo, setMangaInfo] = useState({});

  useEffect(() => {
    const fetchMangaData = async () => {
      const response = await axios.get(
        `https://api.mangadex.org/manga/${mangaID}`
      );
      const mangaObj = await mangaToData(response.data);
      setMangaInfo(mangaObj);
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchMangaData();
      } catch (e) {
        setError("Could not fetch manga info from MangaDex API");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [mangaID]);

  return { isLoading, error, mangaInfo };
};

export default GetManga;
