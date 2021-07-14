import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MangaPage from '../components/MangaPage';
import MangaSearchPage from '../components/MangaSearchPage';
import ReadChapterPage from '../components/ReadChapterPage';

const AppRouter = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <MangaSearchPage />
          </Route>
          <Route path="/manga/:id" exact>
            <MangaPage />
          </Route>
          <Route path="/manga/:mangaID/chapter/:chapterID">
            <ReadChapterPage />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  };
  
  export default AppRouter;