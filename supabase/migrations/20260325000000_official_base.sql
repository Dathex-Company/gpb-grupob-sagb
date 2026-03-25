-- Create Enum Types
CREATE TYPE official_status AS ENUM ('Oficial', 'Homologado', 'Recomendado', 'Experimental', 'Legado', 'Proibido');
CREATE TYPE official_protocol_family AS ENUM ('GERAC-I', 'GERAC-D', 'GERAC-G', 'GERAC-S', 'GERAC-O');
CREATE TYPE official_protocol_criticality AS ENUM ('Baixa', 'Média', 'Alta', 'Crítica');
CREATE TYPE official_pattern_type AS ENUM ('Stack', 'Design Token', 'Fonte', 'Paleta', 'Componente', 'Biblioteca', 'Plataforma', 'Naming', 'Arquitetura', 'Outro');

-- Create Official Protocols Table
CREATE TABLE IF NOT EXISTS public.official_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    family official_protocol_family NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    objective TEXT,
    criticality official_protocol_criticality NOT NULL,
    mandatory BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    status official_status NOT NULL DEFAULT 'Experimental',
    responsible_area TEXT NOT NULL,
    impacted_modules TEXT[] DEFAULT '{}',
    version INTEGER DEFAULT 1,
    last_review_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    payload JSONB DEFAULT '{}'::jsonb,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Official Patterns Table
CREATE TABLE IF NOT EXISTS public.official_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    pattern_type official_pattern_type NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    value_or_definition TEXT NOT NULL,
    status official_status NOT NULL DEFAULT 'Experimental',
    responsible_area TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    last_review_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    payload JSONB DEFAULT '{}'::jsonb,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.official_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON public.official_protocols FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.official_protocols FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.official_patterns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.official_patterns FOR ALL USING (auth.role() = 'authenticated');
