import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

const ChaptertoData = (mangaid, chapters) => {
  return chapters.map(
    ({
      data: {
        id,
        attributes: {
          chapter,
          title,
          hash,
          data,
          dataSaver,
          createdAt,
        },
      },
      relationships,
    }) => {
      const timestamp = new Date(createdAt).getTime() / 1000;
      const groups = relationships
        .filter(({ type }) => type === "scanlation_group")
        .map(({ id }) => id);
      return {
        hash,
        data,
        dataSaver,
        id,
        mangaid,
        chapter,
        title,
        timestamp,
        groups,
      };
    }
  );
};

const FetchChapterList = (mangaid, language, offset, limit) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const getChaptersData = async () => {
      const getChapterList = (offset, limit) => {
        return axios.get(`https://api.mangadex.org/manga/${mangaid}/feed`, {
          params: {
            order: { chapter: "desc" },
            limit,
            offset,
            translatedLanguage: [language],
          },
          paramsSerializer: (params) => {
            return qs.stringify(params);
          },
        });
      };

      let offset = 0;
      const limit = 500;
      const response = await getChapterList(offset, limit);
      let allChapters = [];
      allChapters = allChapters.concat(response.data.results);

      for (
        let i = 0;
        i < Math.ceil((response.data.total - limit) / limit);
        i++
      ) {
        offset += limit;
        const nextResponse = await getChapterList(offset, limit);
        console.log(nextResponse);
        allChapters = allChapters.concat(nextResponse.data.results);
      }

      const chaptersNoGroupnames = ChaptertoData(mangaid, allChapters);

      const groupList = Array.from(
        new Set(
          chaptersNoGroupnames.reduce(
            (acc, { groups }) => acc.concat(groups),
            []
          )
        )
      );

      const groupsMapping = {};

      const {
        data: { results },
      } = await axios.get("https://api.mangadex.org/group", {
        params: { ids: groupList },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      });

      results.forEach(
        ({
          data: {
            id,
            attributes: { name },
          },
        }) => {
          groupsMapping[id] = name;
        }
      );

      const chaptersWithGroupnames = chaptersNoGroupnames.map((chapter) => {
        const groups = {};
        chapter.groups.forEach((id) => {
          groups[id] = groupsMapping[id];
        });
        return {
          ...chapter,
          groups,
        };
      });

      setChapters(chaptersWithGroupnames);
    };
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getChaptersData();
      } catch (e) {
        setError("Could not get Chapter Data from MangaDex API");
      }
      setIsLoading(false);
    };
    fetchData();
  }, [mangaid, language, offset, limit]);

  return { isLoading, error, chapters };
};

export default FetchChapterList;
