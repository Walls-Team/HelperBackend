import { QueryClientDto } from 'src/modules/client/dto/search.dto';

export class SearcClientService {
  public static search(account: any, query: QueryClientDto ) {
    /* 
      Obtener informacion del Cliente
    */
    let filters = {};
    let accountHelper = account.helper;
    let accountCustomer = account.customer;
    let searchCoordinates = [];

    if (accountHelper) {
      if (accountHelper.location.coordinates.length === 0) {
        if (accountCustomer.location.coordinates.length != 0) {
          searchCoordinates = accountCustomer.location;
        }
      } else {
        searchCoordinates = accountHelper.location;
      }
    } else {
      if (accountCustomer.location.coordinates.length != 0) {
        searchCoordinates = accountCustomer.location;
      }
    }

    if (accountHelper) {
      filters['_id'] = { $ne: accountCustomer._id };
    }

    if (query.distanceRange) {
      /* 
          Busqueda por rango de distancia
      */
      filters['location'] = {
        $near: {
          $geometry: searchCoordinates,
          $minDistance: 0,
          $maxDistance: query.distanceRange,
        },
      };
    }

    if (query.minDistance && query.maxDistance) {
      if (query.minDistance >= query.maxDistance) {
        return {
          statuSearch: false,
          err: 'The minimum distance must be less than the maximum distance',
          filters: {},
        };
      }

      filters['location'] = {
        $near: {
          $geometry: searchCoordinates,
          $minDistance: query.minDistance,
          $maxDistance: query.maxDistance,
        },
      };
    }

    if (Object.keys(filters).length === 0) {
      /* 
           Por default si no hay filtros buscar siempre a 500 metros
      */
      filters['location'] = {
        $near: {
          $geometry: searchCoordinates,
          $minDistance: 0,
          $maxDistance: 500,
        },
      };
    }

    if (query.areas && query.areas.length > 0) {
      filters['areas'] = { $in: query.areas };
    }

    if (query.jobs && query.jobs.length > 0) {
      filters['jobs'] = { $in: query.jobs };
    }

    if (query.specials && query.specials.length > 0) {
      filters['specials'] = { $in: query.specials };
    }

    return {
      statuSearch: true,
      err: '',
      filters,
    };
  }
}
