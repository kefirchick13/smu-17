alter table projects drop constraint projects_type_check;

alter table projects add constraint projects_type_check
    check (type in ('industrial', 'warehouse', 'cottage', 'design', 'other'));