"use client";

import { API_URL } from "@/lib/api";

import { useContext, useEffect, useRef, useState, useCallback } from "react";

import RecipeCard from '../components/RecipeCard';
import RecipeFilters, { RecipeFiltersState } from "../components/RecipeFilters";

import HomeStyles from '@/app/styles/pages/home.module.css';
import { AuthContext } from '@/context/AuthContext';
import EmptyView from "../components/EmptyView";
import { Recipe } from "@/types/RecipeTypes";

const PAGE_SIZE = 4;

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<RecipeFiltersState>({
    search: "",
    selectedDiet: 0,
    selectedCuisine: 0,
    time: 15,
    onlyUsers: false,
    onlyInStock: false,
    selectedSort: 3,
  });

  const auth = useContext(AuthContext);
  const loggedUserId = auth?.user?.id;

  const filtersRef = useRef(filters);
  const loggedUserIdRef = useRef(loggedUserId);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    loggedUserIdRef.current = loggedUserId;
  }, [loggedUserId]);

  const buildUrl = (pageNum: number) => {
    const f = filtersRef.current;
    const userId = loggedUserIdRef.current;

    const params = new URLSearchParams({
      currentUserId: userId?.toString() ?? "",
      page: pageNum.toString(),
      pageSize: PAGE_SIZE.toString(),
      search: f.search,
      sortBy: f.selectedSort.toString(),
      onlyUsers: f.onlyUsers.toString(),
      onlyInStock: f.onlyInStock.toString(),
    });
    if (f.selectedDiet) params.set("dietId", f.selectedDiet.toString());
    if (f.selectedCuisine) params.set("cuisineId", f.selectedCuisine.toString());
    return `${API_URL}/api/recipes?${params}`;
  };

  const fetchMore = async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const res = await fetch(buildUrl(pageRef.current));
      const data = await res.json();

      setRecipes(prev => {
        const existingIds = new Set(prev.map(r => r.id));
        const fresh = data.recipes.filter((r: Recipe) => !existingIds.has(r.id));
        return [...prev, ...fresh];
      });

      const newHasMore = pageRef.current * PAGE_SIZE < data.totalCount;
      hasMoreRef.current = newHasMore;
      setHasMore(newHasMore);
      pageRef.current += 1;

    } catch (err) {
      console.error(err);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (auth?.loading) return;

    let cancelled = false;

    const fetchFirst = async () => {
      setLoading(true);
      setRecipes([]);
      setHasMore(true);
      pageRef.current = 1;
      hasMoreRef.current = true;
      loadingMoreRef.current = false;

      try {
        const res = await fetch(buildUrl(1));
        const data = await res.json();
        if (cancelled) return;

        setRecipes(data.recipes);
        const newHasMore = PAGE_SIZE < data.totalCount;
        hasMoreRef.current = newHasMore;
        setHasMore(newHasMore);
        pageRef.current = 2;

      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFirst();
    return () => { cancelled = true; };
  }, [filters, loggedUserId, auth?.loading]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);
  
  if (auth?.loading || loading) {
    return (
      <main className={HomeStyles.home}>
        <div className={HomeStyles.header} />
        <div className={HomeStyles.main}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={HomeStyles.skeletonCard}>
              <span className={HomeStyles.skeletonCardInfo}><span /></span>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className={HomeStyles.home}>
      <div className={HomeStyles.header}>
        <RecipeFilters filters={filters} onChange={setFilters} onlyUsersFilter={true} />
      </div>

      {recipes.length === 0 ? (
        <EmptyView title="No recipes found" text="No recipes match your search" icon="recipe" btnUrl="./" btnText="Back" />
      ) : (
        <ul className={HomeStyles.recipes}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      )}

      <div ref={loaderRef} style={{ height: 1 }} />
      {loadingMore && <p style={{ textAlign: "center" }}>Loading more...</p>}
      {!hasMore && recipes.length > 0 && <p style={{ textAlign: "center", opacity: 0.5 }}>All recipes loaded</p>}
    </main>
  );
}