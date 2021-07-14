import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FetchChapterList from "./getChapters";
import GetManga from "./getManga";
import {
  ListItem,
  List,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
} from "@material-ui/core";
import axios from "axios";
import Loader from "./LoadScreen";
import ChapterList from "./ChapterList";

const ReadChapterPage = () => {
  const { mangaID, chapterID } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterInfo, setChapterInfo] = useState({});
  const [chapterPages, setChapterPages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const {
    isLoading: mangaLoading,
    error: mangaError,
    mangaInfo,
  } = GetManga(mangaID);

  const {
    isLoading: chapterLoading,
    error: chapterError,
    chapters: allChapters,
  } = FetchChapterList(mangaID, "en", 0, 500);

  console.log(allChapters);

  useEffect(() => {
    const fetchChapterInfo = () => {
      const currChapter = allChapters.find(
        (chapter) => chapter.id === chapterID
      );
      if (!currChapter) {
        throw new Error();
      }
      const currChapterwithManga = {
        ...currChapter,
        mangaTitle: mangaInfo.title,
      };
      setChapterInfo(currChapterwithManga);
      return currChapter;
    };

    const fetchPages = async (currChapter) => {
      const response = await axios.get(
        `https://api.mangadex.org/at-home/server/${chapterID}`
      );
      const { baseUrl } = response.data;
      const { data: pages } = currChapter;
      const pageURLs = pages.map(
        (page) => `${baseUrl}/data/${currChapter.hash}/${page}`
      );
      setChapterPages(pageURLs);
      setImagesLoaded(0);
      setTimeout(() => {
        setImagesLoaded(pageURLs.length);
      }, 10000);
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currChapter = fetchChapterInfo();
        await fetchPages(currChapter);
      } catch (e) {
        setError(`Error in Fetching Chapter Data`);
      }
      setIsLoading(false);
    };
    if (!mangaLoading && !chapterLoading) {
      fetchData();
    }
  }, [chapterID, mangaLoading, chapterLoading, allChapters, mangaInfo.title]);

  const imagesLoading = !(
    chapterPages.length > 0 && imagesLoaded >= chapterPages.length
  );

  const pagestoDisplay = chapterPages.map((chapterPage, index) => (
    <ListItem
      key={chapterPage}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        style={{
          width: "auto",
          maxWidth: "100%",
          display: imagesLoading ? "none" : "flex",
          justifyContent: "center",
        }}
        src={chapterPage}
        alt={`Error loading page ${index + 1}`}
        onLoad={() => setImagesLoaded(imagesLoaded + 1)}
      />
    </ListItem>
  ));

  if (isLoading) {
    return <Loader />;
  } else if (error) {
    return <div>Error</div>;
  } else if (chapterError) {
    return <div>Error Loading Chapters</div>;
  } else if (mangaError) {
    return <div>Error Loading Manga</div>;
  } else {
    const {
      id: chapterId,
      mangaTitle,
      chapter: chapterNumber,
      title,
      groups: groupsMapping,
    } = chapterInfo;
    const groups = Object.keys(groupsMapping);
    let prevChapter, nextChapter, scanlatorNames;
    if (allChapters) {
      const index = allChapters.findIndex(
        (chapter) => chapter.id === chapterId
      );

      let prevChapterNumber;
      for (let i = index; i < allChapters.length; i += 1) {
        if (chapterNumber !== allChapters[i].chapter) {
          prevChapterNumber = allChapters[i].chapter;
          break;
        }
      }

      let nextChapterNumber;
      for (let i = index; i >= 0; i -= 1) {
        if (chapterNumber !== allChapters[i].chapter) {
          nextChapterNumber = allChapters[i].chapter;
          break;
        }
      }

      const beforeChapters = allChapters.filter(
        (chapter) => chapter.chapter === prevChapterNumber
      );
      const beforeBySameScanlator = beforeChapters.find((chapter) => {
        for (const group of groups) {
          return chapter.groups[group] !== undefined;
        }
        return null;
      });

      const afterChapters = allChapters.filter(
        (chapter) => chapter.chapter === nextChapterNumber
      );
      const afterBySameScanlator = afterChapters.find((chapter) => {
        for (const group of groups) {
          return chapter.groups[group] !== undefined;
        }
        return null;
      });

      // If the previous/next chapter has a scan by the same scanlator, link to that one
      prevChapter =
        beforeBySameScanlator || beforeChapters[beforeChapters.length - 1];
      nextChapter =
        afterBySameScanlator || afterChapters[afterChapters.length - 1];

      const currentChapterFoundInList = allChapters.find(
        (chapter) => chapter.id === chapterInfo.id
      );
      scanlatorNames = Object.values(currentChapterFoundInList.groups).join(
        ", "
      );
    }

    const ChapterNav = () => {
      return (
        <div style={{ width: "50%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              id={prevChapter && prevChapter.id}
              disabled={!prevChapter}
              variant="contained"
              color="primary"
              component={Link}
              to={`/manga/${mangaID}/chapter/${prevChapter && prevChapter.id}`}
              style={{ flexGrow: 1, marginLeft: 5 }}
            >
              Prev Chapter
            </Button>
            <span style={{ flexGrow: 1 }} />
            <Button
              id={nextChapter && nextChapter.id}
              disabled={!nextChapter}
              variant="contained"
              color="primary"
              component={Link}
              to={`/manga/${mangaID}/chapter/${nextChapter && nextChapter.id}`}
              style={{ flexGrow: 1, marginRight: 5 }}
            >
              Next Chapter
            </Button>
          </div>
          <br />
          <ChapterList chapters={allChapters} />
          <br />
        </div>
      );
    };

    const ChapterHeader = () => {
      return (
        <div>
          <AppBar position="sticky">
            <Toolbar>
              <Button
                component={Link}
                to={`/?s=${mangaTitle}`}
                style={{
                  flexGrow: 1,
                  marginLeft: 5,
                  textSizeLarge: true,
                  color: "white",
                }}
              >
                <Typography variant="subtitle1">Back to Search</Typography>
              </Button>
              <Button
                component={Link}
                to={`/manga/${mangaInfo.id}`}
                style={{
                  flexGrow: 1,
                  marginRight: 5,
                  textSizeLarge: true,
                  float: "right",
                  color: "white",
                }}
              >
                <Typography variant="subtitle1">Back to Manga Page</Typography>
              </Button>
            </Toolbar>
          </AppBar>
          <br />
          <Container maxWidth="lg">
            <Card alignItems="center">
              <CardContent>
                <Typography variant="h4">{mangaTitle}</Typography>
                <Typography variant="h6">
                  Chapter {chapterInfo.chapter} {title ? ` - ${title}` : ``}
                  <br />
                  Author: {mangaInfo.author}
                  <br />
                  Artist: {mangaInfo.artist}
                  <br />
                  Scanlated By: {scanlatorNames}
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </div>
      );
    };

    return (
      <div>
        <ChapterHeader />
        <br />
        <Container maxWidth="lg" alignItems="center">
          <Grid
            alignItems="center"
            justify="center"
            container={true}
            direction="column"
            lg="auto"
          >
            <ChapterNav />
            <Box alignItems="center">
              {imagesLoading && (
                <Box width="100%" display="flex">
                  <CircularProgress
                    variant="determinate"
                    color="secondary"
                    size={100}
                    thickness={2.5}
                    value={(imagesLoaded / chapterPages.length) * 100}
                  />
                </Box>
              )}
            </Box>
            <List>{pagestoDisplay}</List>
            <br />
            <ChapterNav />
          </Grid>
        </Container>
      </div>
    );
  }
};

export default ReadChapterPage;
