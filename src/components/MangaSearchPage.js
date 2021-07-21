import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import MangaSearchList from "./MangaSearchList";
import axios from "axios";
import Loader from "./LoadScreen";
import { Container, Grid, Button } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import { green } from "@material-ui/core/colors";

function MangaSearchPage() {
  const { search } = window.location;
  let query = new URLSearchParams(search).get("s");
  const [isLoading, setIsLoading] = useState(true);
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);
  const [topManga, setTopManga] = useState(false);

  if (query === null || query === "") {
    query = "null";
  }

  useEffect(() => {
    const FetchMangaList = async () => {
      const getMangaList = () => {
        if (topManga) {
          return axios.get(
            `https://api.mangadex.org/manga?title=&includes[]=author&includes[]=artist&includes[]=cover_art`
          );
        } else {
          return axios.get(
            `https://api.mangadex.org/manga?title=${query}&includes[]=author&includes[]=artist&includes[]=cover_art`
          );
        }
      };

      const response = await getMangaList();
      let allManga = [];
      allManga = allManga.concat(response.data.results);
      setMangaList(allManga);
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await FetchMangaList();
      } catch (e) {
        setError(e.toString());
      }
      setIsLoading(false);
    };
    fetchData();
  }, [setIsLoading, setError, setMangaList, query, topManga]);

  if (isLoading) {
    return <Loader />;
  } else if (error) {
    return <div>{error}</div>;
  } else {
    return (
      <div className="App">
        <SearchBar />
        <Button
          variant="contained"
          size="small"
          onClick={() => setTopManga(!topManga)}
          style={{ textTransform: "none", padding: 5 }}
          startIcon={
            topManga ? (
              <StarIcon fontSize="small" style={{ color: green[500] }} />
            ) : (
              <StarIcon fontSize="small" color="secondary" />
            )
          }
        >
          Sort By Top
        </Button>
        <Container
        >
          <Grid
            alignItems="center"
            justify="center"
            container={true}
            direction="column"
          >
            {!topManga ? <h2>Results for "{query}"</h2> : <h2>Top Manga</h2>}
            <MangaSearchList mangaList={mangaList} />
          </Grid>
        </Container>
      </div>
    );
  }
}

export default MangaSearchPage;
