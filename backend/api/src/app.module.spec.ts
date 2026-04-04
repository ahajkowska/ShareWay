import { AppModule } from './app.module';

describe('AppModule (import-time coverage)', () => {
  it('module is defined after import', () => {
    expect(AppModule).toBeDefined();
  });
});
