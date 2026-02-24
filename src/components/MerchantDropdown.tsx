"use client";

import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "@/utils/axios";

interface Merchant {
  id: number;
  name: string;
  email: string;
  webhook_url: string | null;
  status: string;
}

interface MerchantDropdownProps {
  value: number | "";
  onChange: (id: number | "") => void;
}

const MerchantDropdown = ({ value, onChange }: MerchantDropdownProps) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axiosInstance
      .get("/platform/merchant")
      .then((res) => {
        const all: Merchant[] = res.data.data;
        const active = all.filter((m) => m.status === "active").reverse();
        setMerchants(active);
        if (active.length > 0) onChange(active[0].id);
      })
      .catch(() => {
        setMerchants([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const selected = merchants.find((m) => m.id === value) ?? null;
  const filtered = merchants.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (id: number) => {
    onChange(id);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (loading) return;
    if (e.key === "Enter" || e.key === " ") {
      if (!open) {
        setOpen(true);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
      containerRef.current?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const options =
        containerRef.current?.querySelectorAll<HTMLLIElement>("li[tabindex]");
      if (!options || options.length === 0) return;
      const focused = document.activeElement as HTMLElement;
      const list = Array.from(options);
      const idx = list.indexOf(focused as HTMLLIElement);
      if (e.key === "ArrowDown") {
        (list[idx + 1] ?? list[0]).focus();
      } else {
        (list[idx - 1] ?? list[list.length - 1]).focus();
      }
    }
  };

  return (
    <div className="space-y-2 w-full min-w-50">
      <div
        ref={containerRef}
        className="relative w-full outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Trigger button */}
        <div
          onClick={() => !loading && setOpen((o) => !o)}
          className={`
            relative cursor-pointer select-none
            bg-[#1C1F2D] rounded-md
            h-[42px] leading-[40px]
            px-[18px] pr-[30px]
            text-sm font-normal text-left text-white
            transition-all duration-200
            ${
              open
                ? "border border-[#2979FF] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]"
                : "border border-[#474F71] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.4)]"
            }
            ${loading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          <span className={selected ? "text-white" : "text-[#6B7280]"}>
            {loading
              ? "Loading..."
              : selected
                ? selected.name
                : "Select Merchant"}
          </span>
          {/* Chevron */}
          <span
            className={`
              absolute right-[10px] top-1/2
              w-0 h-0
              border-l-[4px] border-l-transparent
              border-r-[4px] border-r-transparent
              border-t-[4px] border-t-[#9CA3AF]
              transition-transform duration-[125ms]
              ${open ? "-translate-y-1/2 rotate-180" : "-translate-y-1/2"}
            `}
          />
        </div>

        {/* Dropdown list */}
        <div
          className={`
            absolute top-full left-0 right-0 z-[999]
            bg-[#1C1F2D] border border-[#474F71] rounded-md
            shadow-[0_8px_24px_rgba(0,0,0,0.5)]
            mt-1 py-[3px]
            max-h-[250px] overflow-auto
            transition-all duration-150 origin-top
            ${open ? "scale-100 opacity-100 pointer-events-auto" : "scale-75 opacity-0 pointer-events-none"}
          `}
        >
          {/* Search */}
          <div className="flex items-center justify-center m-2">
            <input
              ref={searchRef}
              type="text"
              autoComplete="off"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-[90%] px-2 py-2 bg-[#00041F] border border-[#474F71] rounded focus:border-[#2979FF] outline-none text-sm text-white placeholder-[#6B7280]"
            />
          </div>

          {/* Options */}
          <ul className="p-0 m-0 list-none">
            {filtered.map((m) => (
              <li
                key={m.id}
                tabIndex={open ? 0 : -1}
                onClick={() => handleSelect(m.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(m.id);
                }}
                className={`
                  px-[18px] pr-[29px] h-[40px] leading-[40px]
                  text-sm text-left cursor-pointer outline-none
                  transition-colors duration-200
                  hover:bg-[#2979FF]/20 focus:bg-[#2979FF]/20
                  ${value === m.id ? "font-semibold text-[#2979FF]" : "font-normal text-white"}
                `}
              >
                {m.name}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-[18px] h-[40px] leading-[40px] text-sm text-[#6B7280]">
                No results
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MerchantDropdown;
