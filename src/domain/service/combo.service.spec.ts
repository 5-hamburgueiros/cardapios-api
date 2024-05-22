import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { IComboService } from './combo.service'; // Ajuste o caminho de importação conforme necessário

class MockComboService implements IComboService {
  async paginate<T>(options: IPaginationOptions, query: any): Promise<Pagination<T>> {
    const items = query.items.slice((options.page - 1) * options.limit, options.page * options.limit);
    const pagination: Pagination<T> = {
      items: items,
      meta: {
        itemCount: items.length,
        totalItems: query.items.length,
        itemsPerPage: options.limit,
        totalPages: Math.ceil(query.items.length / options.limit),
        currentPage: options.page,
      },
    };
    return pagination;
  }
}

describe('IComboService', () => {
  let service: IComboService;

  beforeEach(() => {
    service = new MockComboService();
  });

  it('deve paginar resultados corretamente', async () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
    const options: IPaginationOptions = { page: 2, limit: 10 };
    const query = { items: items };

    const result = await service.paginate(options, query);

    expect(result.items.length).toBe(10);
    expect(result.items[0].id).toBe(11);
    expect(result.items[9].id).toBe(20);
    expect(result.meta.totalItems).toBe(50);
    expect(result.meta.totalPages).toBe(5);
    expect(result.meta.currentPage).toBe(2);
  });
});
