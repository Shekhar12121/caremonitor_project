import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { MockApiService, ListItem } from '../services/mock-api.service';

type ItemsState = {
  items: ListItem[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ItemsState = {
  items: [],
  isLoading: false,
  error: null
};

export const ItemsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, mockApiService = inject(MockApiService)) => ({
    loadItems: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          mockApiService.getItems().pipe(
            tap(items => patchState(store, { items, isLoading: false })),
            catchError(error => {
              patchState(store, {
                error: error.message || 'Failed to load items',
                isLoading: false
              });
              return of([]);
            })
          )
        )
      )
    )
  }))
);
