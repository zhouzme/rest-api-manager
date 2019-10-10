const Configs = {
    ApiListUrl: () => localStorage.getItem('ApiListUrl'),
    setApiListUrl: (v) => localStorage.setItem('ApiListUrl', v),
    ApiRequestUrl: () => localStorage.getItem('ApiRequestUrl'),
    setApiRequestUrl: (v) => localStorage.setItem('ApiRequestUrl', v),
};

export default Configs;
