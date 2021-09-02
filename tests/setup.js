import LocalStorageMock from './LocalStorageMock';
global.localStorage = new LocalStorageMock;
global.fetch = jest.fn();