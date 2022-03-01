import React, {useEffect} from 'react';
import RouterContext from './RouterContext';
import HistoryContext from './HistoryContext';

const computeRootMatch = (pathname) => {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
}
const Router = ({history, children}) => {
    const [location, setLocation] = useState({})
    useEffect(() => {
        setLocation(history.location);
        const unListen = history.listen(({location}) => {
            setLocation(location);
        });
        return () => {
            unListen && unListen();
        }
    }, [])
    return <RouterContext.Provider value={{
        history,
        location,
        match: computeRootMatch(location.pathname)
    }}>
        <HistoryContext.Provider children={children} value={history}/>
    </RouterContext.Provider>
}

export default Router;

// RouterContext.Provider 

// import { useLocation,useParams,useRouteMatch} from 'react-router-dom'

// HistoryContext.Provider

// import {useHistory} from 'react-router-dom'

// Router 添加了 RouterContext.Provider 、HistoryContext.Provider 以及对 history.listen
// 当history.listen 更新的时候，更新location