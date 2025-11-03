using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IGenericService<T> where T : class
    {
        Task TAddAsync(T entity);
        Task TUpdateAsync(T entity);
        Task TDeleteAsync(T entity);
        Task<T> TGetByIdAsync(int id);
        Task<List<T>> TGetAllAsync();
        Task<List<T>> TGetListByFilterAsync(Expression<Func<T, bool>> filter);
    }
}
